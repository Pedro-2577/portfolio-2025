<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;

class ContactForm extends Component
{
    public $name = '';
    public $email = '';
    public $subject = '';
    public $message = '';
    public $isSubmitted = false;

    protected $rateLimiting = 5; // 5 requests per minute

    protected $rules = [
        'name' => 'required|min:2|max:255',
        'email' => 'required|email|max:255',
        'subject' => 'required|min:5|max:255',
        'message' => 'required|min:10|max:1000',
    ];

    protected $messages = [
        'name.required' => 'El nombre es obligatorio.',
        'name.min' => 'El nombre debe tener al menos 2 caracteres.',
        'name.max' => 'El nombre no puede tener más de 255 caracteres.',
        'email.required' => 'El email es obligatorio.',
        'email.email' => 'El email debe ser válido.',
        'email.max' => 'El email no puede tener más de 255 caracteres.',
        'subject.required' => 'El asunto es obligatorio.',
        'subject.min' => 'El asunto debe tener al menos 5 caracteres.',
        'subject.max' => 'El asunto no puede tener más de 255 caracteres.',
        'message.required' => 'El mensaje es obligatorio.',
        'message.min' => 'El mensaje debe tener al menos 10 caracteres.',
        'message.max' => 'El mensaje no puede tener más de 1000 caracteres.',
    ];

    public function updated($propertyName)
    {
        $this->validateOnly($propertyName);
    }

    public function submit()
    {
        $this->validate();

        // Rate limiting check
        $key = 'contact_form_' . request()->ip();
        $attempts = cache()->get($key, 0);
        
        if ($attempts >= $this->rateLimiting) {
            session()->flash('error', 'Has enviado demasiados mensajes. Por favor, espera un momento antes de intentar de nuevo.');
            return;
        }

        try {
            // Send email
            Mail::to(config('mail.from.address'))
                ->send(new ContactMail($this->name, $this->email, $this->subject, $this->message));

            // Increment rate limit counter
            cache()->put($key, $attempts + 1, now()->addMinutes(1));

            $this->isSubmitted = true;
            $this->reset(['name', 'email', 'subject', 'message']);
            
            session()->flash('message', '¡Mensaje enviado correctamente! Te responderé pronto.');
        } catch (\Exception $e) {
            session()->flash('error', 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        }
    }

    public function render()
    {
        return view('livewire.contact-form');
    }
}
